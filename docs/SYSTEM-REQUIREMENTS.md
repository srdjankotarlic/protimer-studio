# System Requirements

## Release status

The current public beta targets Apple Silicon Macs and Windows x64. Windows packages are produced in CI but still need broader real-hardware feedback.

## macOS release candidate

- Apple Silicon Mac (`arm64`).
- macOS 13 Ventura or later recommended.
- 8 GB RAM minimum; 16 GB recommended for video, PDF and multiple outputs.
- 500 MB free disk space for the app, plus space for show media and backups.
- 1280x800 recommended controller workspace; the responsive UI is tested down to 900x600.
- One or more external displays for speaker, confidence or venue output workflows.

Intel Macs are not part of the current release candidate.

## Windows candidate

- Windows 10 or Windows 11, 64-bit.
- 8 GB RAM minimum; 16 GB recommended.
- 500 MB free disk space, plus show media.
- 1280x800 recommended controller workspace.

Windows is a beta target. Verify the installer or portable build on the exact show computer before using it at an event.

## Network

The controller, browser outputs, remote, backstage and Signal Light are designed for a trusted local production network.

- TCP `7878` is the preferred local web port. If occupied, the app tries the next ports up to `7888`.
- UDP `7879` is the default OSC control port.
- Allow the app through the operating-system firewall on private networks.
- Put the show computer and browser devices on the same wired LAN or private production Wi-Fi.
- Do not expose the local ports directly to the public internet.
- Optional online sharing uses an external tunnel and therefore requires internet access; it is not required for normal local operation.

## Media

Show content accepts common PNG, JPEG, GIF, WebP, SVG, MP4, WebM, MOV, M4V and PDF files. Lower Third Studio accepts PNG, SVG, JPEG, MP4/H.264 and WebM VP8/VP9.

Codec support is not the same as guaranteed alpha behavior in every external production application. Test every final media asset on the actual show computer and output path before doors open.

## Production recommendation

Use a dedicated show computer, wired power, disabled sleep/automatic updates and a tested backup plan. Run Preflight after displays and media are connected, then verify every Program destination before the audience enters.
