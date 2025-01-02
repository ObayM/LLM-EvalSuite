// Import Express
import express, { text } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { textSimilarity } from './utils/evaluators.js';
import { getGroqResponse } from './utils/groqClient.js';
import { LLMEvaluate } from './utils/evaluators.js';
import { getGeminiResponse } from './utils/geminiClient.js';

const prisma = new PrismaClient()
const app = express();
app.use(cors());
app.use(express.json());

// Define a route
app.get('/', (req, res) => {
    res.send('Welcome to the Express.js Tutorial');
});

app.get('/projects', async (req,res) => {
    const projects = await prisma.projects.findMany()
    res.json(projects)
})
app.get('/expirments?project_id=', async (req,res) => {
    const {project_id} = req.query
    const expirments = await prisma.experiment.findMany({
        where: {
            project_id: Number(project_id)
        }
    })
    res.json(expirments)
})

app.get('/response?expirment_id=', async (req,res) => {
    const {expirment_id} = req.query
    const response = await prisma.response.findMany({
        where: {
            expirment_id: Number(expirment_id)
        }
    })
    res.json(response)
})

app.get('/evaluations?response_id=', async (req,res) => {
    const {response_id} = req.query
    const evaluations = await prisma.evaluations.findMany({
        where: {
            response_id: String(response_id)
        }
    })
    res.json(evaluations)
})

app.get('/avilable_llms', (req,res) => {
    const AVAILABLE_LLMS = [
        "gemini-1.5-flash",
        "gemini-2.0-flash-exp",
        "gemini-1.5-flash-8b",
        "gemini-1.5-pro",
        "llama-3.1-8b-instant",
        "llama-3.3-70b-versatile",
        "mixtral-8x7b-32768"
    ];

    res.json(AVAILABLE_LLMS)
})

// POST routes



app.post('/new_project', async(req,res) => {
    const {title, description, system_prompt, LLMs, Eval_LLM} = req.body
    const project = await prisma.projects.create({
        data: {
            title,
            description,
            system_prompt,
            LLMs,
            Eval_LLM
        }
    })
    res.json(project)
})

app.post('/new_expirment', async(req,res) => {
    const {project_id,title, description, Eval_criteria, prompt, expected_out} = req.body
    const expirment = await prisma.experiment.create({
        data: {
            project_id,
            title,
            description,
            Eval_criteria,
            prompt,
            expected_out
        }
    })
    res.json(expirment)

})

app.post('/new_response', async(req,res) => {
    const {experiment_id} = req.body
    const expirment = await prisma.experiment.findUnique({
        where: {
            id: experiment_id
        }
    })
    if (!expirment) {
        return res.status(404).json({error: 'Expirment not found'})
    }
    const project = await prisma.projects.findUnique({
        where: {
            id: expirment.project_id
        }
    })


    if (!project){
        return res.status(404).json({error: 'Project not found'})
    }


    const prompt = expirment.prompt
    const LLMs = project.LLMs
    let LLM_Responses = [

    ]
    for (let i = 0; i < LLMs.length; i++){
        const LLM = LLMs[i]
        if (LLM.startsWith("gemini-")){
            const response = await getGeminiResponse(prompt,project.system_prompt,LLM)
            LLM_Responses.push({
                llm: LLM,
                responseTime: response.responseTime,
                response: response.response
            })
        } else{
            const response = await getGroqResponse(prompt,project.system_prompt,LLM)
            LLM_Responses.push({
                llm: LLM,
                responseTime: response.responseTime,
                response: response.response
            })
        }
    }

    const response = await prisma.response.create({
        data: {
            experiment_id,
            LLM_Responses,
        }
    })
    res.json(response)
})

app.post('/new_evaluation', async(req,res) => {
    const {response_id} = req.body
    const response = await prisma.response.findUnique({
        where: {
            id: response_id
        }
    })
    const expirment = await prisma.experiment.findUnique({
        where:{
            id: response.experiment_id
        }
    })
    const project = await prisma.projects.findUnique({
        where: {
            id: expirment.project_id
        }
    })
    const LLM_Responses = response.LLM_Responses
    const criteria = expirment.Eval_criteria
    const expected_output = expirment.expected_out
    const llm_evaluator = project.Eval_LLM

    async function eval_response(response,expected_output,criteria,llm_evaluator) {
        if (criteria === "accuracy"){
            const similarity = textSimilarity(response,expected_output)
            return {
                score:similarity*100,
                comments: `The similarity between the response and the expected output is ${similarity*100}%`
            }
        }else if (criteria === "llm_evaluator"){
            const evaluator_response = await LLMEvaluate(response,expected_output,llm_evaluator)
            let text = evaluator_response
            text = text.replace(/^[\s\S]*?(\{[\s\S]*\})[\s\S]*$/, '$1');
            const json = JSON.parse(text)
            return {
                score:json.score,
                comments: json.comment
            }
        }
            
        
    }
        
    const evaulations = [

    ]


    
    for (let i = 0; i < LLM_Responses.length; i++){
        const LLM_Response = LLM_Responses[i]
        const response = LLM_Response.response
        const evaluation = await eval_response(response,expected_output,criteria,llm_evaluator)
        evaulations.push(
            {
                llm: LLM_Response.llm,
                responseTime: LLM_Response.responseTime,
                score: evaluation.score,
                comments: evaluation.comments
            }
        )
    }

    for (let i = 0; i < evaulations.length; i++){
        const evaluation = evaulations[i]
        await prisma.evaluations.create({
            data: {
                response_id,
                llm: evaluation.llm,
                responseTime: evaluation.responseTime,
                criteria,
                score: evaluation.score,
                comments: evaluation.comments
            }
        })
    }

    res.json(evaulations)
})


// Start the server
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});