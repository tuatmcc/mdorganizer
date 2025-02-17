{
  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    services-flake.url = "github:juspay/services-flake";
    systems.url = "github:nix-systems/default";
  };

  outputs =
    inputs@{ self, nixpkgs, flake-parts, systems, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = import systems;
      perSystem = { config, system, pkgs, ... }: {
        devShells = {
          default = pkgs.mkShell {
            packages = with pkgs; [ nodejs ];
          };
        };
      };
    };
}
