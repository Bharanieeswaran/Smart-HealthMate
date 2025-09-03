{ pkgs, ... }:

{
  # https://www.jetpack.io/devbox/docs/configuration/
  packages = [
    pkgs.zip
  ];
  # Natively supported languages
  # languages = { ... };
  # Or start services
  # services = { ... };
}
