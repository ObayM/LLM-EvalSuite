// Import Express
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

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
            Eval_criteria,
            prompt,
            expected_out
        }
    })
    res.json(expirment)

})

app.post('/new_response', async(req,res) => {
    const {experiment_id, LLM_Responses, response_times} = req.body
    const response = await prisma.response.create({
        data: {
            experiment_id,
            LLM_Responses,
            response_times
        }
    })
    res.json(response)
})

app.post('/new_evaluation', async(req,res) => {
    const {response_id, criteria, score, comments} = req.body
    const evaluation = await prisma.evaluations.create({
        data: {
            response_id,
            criteria,
            score,
            comments
        }
    })
    res.json(evaluation)
})


// Start the server
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});