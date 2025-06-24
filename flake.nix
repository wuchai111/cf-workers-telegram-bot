{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable"; # Or your preferred channel
    # flake-utils is no longer an input
  };

  outputs = inputs @ { self, nixpkgs, ... }: let

    forAllSystems = function:
      nixpkgs.lib.genAttrs [
        "x86_64-linux"
        "aarch64-linux"
        # Add other systems like "x86_64-darwin", "aarch64-darwin" if you need them
      ] (system:
        function (import nixpkgs {
          inherit system;
          # overlays = [ ... ]; # You can add overlays here if needed
          # config = { ... };   # Or pkgs configuration
        }));

  in rec { # 'rec' allows self-reference if needed, e.g., devShells = devShell;

    # This will create devShell.x86_64-linux, devShell.aarch64-linux, etc.
    # `nix develop` on a supported system (e.g., x86_64-linux) will pick up
    # devShell.x86_64-linux automatically.
    devShell = forAllSystems (pkgs: # pkgs for the current system is passed by forAllSystems
      pkgs.mkShell {
        name = "my-dev-environment"; # Optional: give your shell a name
        buildInputs = with pkgs; [
          efm-langserver
          nil
          nodePackages_latest.nodejs   # Consider pinning like nodejs_20 or nodejs_latest
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

    # Optional: flake-utils often provides `devShells` as well,
    # which is identical to `devShell` in this setup.
    # This can be useful for clarity or if some tools expect `devShells.<system>`.
    devShells = devShell;

    # If you had other outputs like packages or apps, they would go here:
    # packages = forAllSystems (pkgs: {
    #   default = pkgs.hello; # Example
    # });
    #
    # apps = forAllSystems (pkgs: {
    #   default = {
    #     type = "app";
    #    program = "${self.packages.${pkgs.system}.default}/bin/hello";
    #  };
    # });
  };
}
