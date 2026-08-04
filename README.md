# M2O documentation

Public, maintainer-authored guides for the M2O scripting API.

The closed-source mod remains authoritative for generated client and server API contracts. The documentation build checks out this repository at an immutable revision and composes these guides with that generated reference.

## Structure

- `guides/` contains scripting concepts and shared catalogs.
- `guides/server/` contains server-only catalogs and resources.
- Image directories live beside the Markdown document that references them.

## Contributing

Open a pull request with the guide or asset change. Keep local image references relative to the Markdown file and avoid active HTML such as scripts, forms, iframes, or inline event handlers.

The M2O build pins the exact commit used for every published documentation deployment, so merged changes are only public after the mod documentation pipeline publishes a new revision.

Merges to `main` dispatch the private M2O documentation workflow. Configure the repository secret `M2O_DOCS_TRIGGER_TOKEN` with permission to send repository-dispatch events to `mafia2online/Mod`. The private repository owns the platform deploy token and authoritative API inputs; this public repository never receives those secrets.
