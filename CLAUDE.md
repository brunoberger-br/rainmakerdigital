# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Local Development

**Docker container:** http://localhost:8086

```bash
docker start rainmakerdigital-site   # Start
docker stop rainmakerdigital-site    # Stop
docker build -t rainmakerdigital . && docker rm -f rainmakerdigital-site && docker run -d -p 8086:80 --name rainmakerdigital-site rainmakerdigital   # Rebuild
```

## Site Design Guidelines

### Design Constraints 
- Light backgrounds for hero and body
- Modern "2026" aesthetic
- Clean and readable
- Visually impactful "wow" factor (orchestrated subtle animations, micro interactions, distinctive layout)
- Professional and trustworthy (premium feel, not playful)
- Avoids generic AI aesthetics (unique type pairing, magnetic interactions)
- Distinctive and memorable

### Colors
- Primary: #0274be
- Primary Dark: #0162a0
- Background: #f5f5f5
- Text Dark: #333333
- Text Muted: #999999
- White: #ffffff

## Site content/copy
See `/homepage-copy.md` file