# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
 pkgs.python3
 pkgs.nodejs_21
 pkgs.openssl
 ];

  # Sets environment variables in the workspace
  env = {
    # You can get a Gemini API key through the IDX Integrations panel to the left!
    POSTGRESQL_CONN_STRING = "postgresql://user:mypassword@localhost:5432/youtube?sslmode=disable";
  };

  services.postgres = {
    enable = true;
  };

  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "mtxr.sqltools-driver-pg"
      "mtxr.sqltools"
    ];

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        default.openFiles = [
          "README.md" "create.sql" "example.sql"
        ];
        # Example: install JS dependencies from NPM
        setup = ''
          initdb -D local
          psql --dbname=postgres -c "ALTER USER \"user\" PASSWORD 'mypassword';"
          psql --dbname=postgres -c "CREATE DATABASE youtube;"
          psql --dbname=youtube -f create.sql
          psql --dbname=youtube -f example.sql
        '';
      };
      # Runs when the workspace is (re)started
      onStart = {

      };
    };

    # Enable previews
    # previews = {
    #   enable = true;
    #   previews = {

    #   };
    # };
  };
}
