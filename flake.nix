{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable"; # Or your preferred channel
  };

  outputs =
    inputs@{ self, nixpkgs, ... }:
    let

      forAllSystems =
        function:
        nixpkgs.lib.genAttrs
          [
            "x86_64-linux"
            "aarch64-linux"
            "x86_64-darwin"
            "aarch64-darwin"
          ]
          (
            system:
            function (
              import nixpkgs {
                inherit system;
                # overlays = [ ... ]; # You can add overlays here if needed
                # config = { ... };   # Or pkgs configuration
              }
            )
          );

    in
    rec {
      devShell = forAllSystems (
        pkgs:
        pkgs.mkShell {
          name = "my-dev-environment";
          buildInputs = with pkgs; [
            efm-langserver
            nil
            nodejs_latest
            nodePackages_latest.typescript-language-server
            nodePackages_latest.prettier
            vscode-langservers-extracted
            nodePackages_latest.bash-language-server
          ];
          # You can add shell hooks or environment variables here too
          # shellHook = ''
          #   echo "Welcome to the development shell!"
          #   export MY_VAR="hello"
          # '';
        }
      );

      devShells = devShell;

      packages = forAllSystems (pkgs: {
        default = pkgs.buildNpmPackage {
          name = "cf-workers-telegram-bot";
          src = ./.;
          npmDepsHash = "sha256-tlxWjtGMnTTMS4or/hZuWEoe+DI6eZRHbOKLsXx/LIY=";
          installPhase = ''
            runHook preInstall
            mkdir -p $out
            cp -r dist/* $out/
            runHook postInstall
          '';
        };
      });

      apps = forAllSystems (pkgs: {
        default = {
          type = "app";
          program = "${pkgs.writeScriptBin "run-worker" ''
            #!/bin/sh
            ${pkgs.nodejs_latest}/bin/node ${self.packages.${pkgs.system}.default}/worker.js "$@"
          ''}/bin/run-worker";
        };
      });
    };
}
