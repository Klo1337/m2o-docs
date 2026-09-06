---
title: Linux dedicated server
group: Guides
---

# Running a dedicated server on Linux

The dedicated server ships as native Linux binaries inside every build archive, under `server-linux/`:

- `M2OServer` — the server executable
- `libnode.so.141` — the bundled Node.js runtime that executes server resources
- `crashpad_handler` — the crash reporter (optional to run, keep it next to the server)

## Requirements

- x86-64 Linux with **glibc 2.38 or newer** — Ubuntu 24.04+, Debian 13 (trixie)+.
  On older distributions (Ubuntu 22.04, Debian 12) the binary does not start: the
  loader reports missing `GLIBC_2.38` / `GLIBCXX_3.4.32` symbols. There is no
  workaround short of upgrading the distribution or running a newer one in a container.
- The usual runtime libraries. On a minimal Ubuntu/Debian install:

```sh
sudo apt-get update
sudo apt-get install -y libatomic1 libstdc++6 libgcc-s1 libcurl4 openssl ca-certificates unzip
```

## Install

Unpack `server-linux/` from the build archive into a directory of its own and make the binaries executable — a zip transfer does not always preserve the executable bit:

```sh
mkdir -p ~/m2o-server && cd ~/m2o-server
unzip -j /path/to/M2O-<version>.zip '*server-linux/*' -d .
chmod +x M2OServer crashpad_handler
```

Put your resources next to the binaries, one directory per resource:

```
~/m2o-server/
├── M2OServer
├── libnode.so.141
├── crashpad_handler
└── resources/
    └── my-gamemode/
        ├── package.json
        ├── server/main.js
        └── client/main.js
```

Each resource declares its entry points in `package.json`; only the `client/` part of a resource is streamed to players:

```json
{
  "name": "my-gamemode",
  "version": "0.1.0",
  "mafiahub": {
    "server": "server/main.js",
    "client": "client/main.js",
    "priority": 20
  }
}
```

## Run

```sh
cd ~/m2o-server
export LD_LIBRARY_PATH=.
export TRACY_NO_INVARIANT_CHECK=1
./M2OServer
```

- `LD_LIBRARY_PATH=.` lets the loader find `libnode.so.141` next to the executable.
- `TRACY_NO_INVARIANT_CHECK=1` matters on VPS and older CPUs: without an invariant
  TSC the embedded profiler aborts the server on startup with exit code 1 and no
  useful message. Setting the variable is harmless everywhere, so just always set it.

## Open the firewall

The game talks over UDP on the server port (default **27015**). Open it, e.g. with ufw:

```sh
sudo ufw allow 27015/udp
```

If players see the server but time out while connecting (the log shows an incoming
connection request, then `Connection lost` after ~20 s), the usual culprits are a
closed/unforwarded UDP port or a path with a reduced MTU (VPN or tunnel) between
the player and the server.

## Keep it running

A minimal systemd unit:

```ini
# /etc/systemd/system/m2oserver.service
[Unit]
Description=M2O dedicated server
After=network.target

[Service]
WorkingDirectory=/home/m2o/m2o-server
Environment=LD_LIBRARY_PATH=.
Environment=TRACY_NO_INVARIANT_CHECK=1
ExecStart=/home/m2o/m2o-server/M2OServer
Restart=on-failure
User=m2o

[Install]
WantedBy=multi-user.target
```

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now m2oserver
journalctl -u m2oserver -f
```

The same layout works fine inside Docker — use an Ubuntu 24.04 (or newer) base image
so the glibc requirement is met, install the packages from step 1, and set the same
two environment variables.

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| `version 'GLIBC_2.38' not found` / `GLIBCXX_3.4.32` on start | Distribution too old — use Ubuntu 24.04+ / Debian 13+ (bare or as container base) |
| Exits with code 1 immediately on a VPS | No invariant TSC — set `TRACY_NO_INVARIANT_CHECK=1` |
| `error while loading shared libraries: libnode.so.141` | `LD_LIBRARY_PATH` does not include the server directory |
| Players time out after `Incoming connection request` | UDP port closed/unforwarded, or reduced-MTU path (VPN/tunnel) on the player side |
| A resource silently does nothing | Syntax error in its JS — check the server log at startup; validate with `node --check` before shipping |
