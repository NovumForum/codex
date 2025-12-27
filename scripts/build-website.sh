#!/usr/bin/env bash
# Build script to prepare the website for deployment

set -e

echo "Building website..."

# Create docs directory if it doesn't exist
mkdir -p website/docs

# Copy markdown files and convert them to basic HTML pages
for mdfile in docs/*.md; do
    filename=$(basename "$mdfile" .md)
    echo "Processing $filename..."
    
    # Create a simple HTML wrapper for markdown content
    cat > "website/docs/${filename}.html" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename} - Codex CLI Documentation</title>
    <link rel="stylesheet" href="../style.css">
    <style>
        .doc-content {
            max-width: 900px;
            margin: 2rem auto;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .doc-content h1 {
            color: #667eea;
            border-bottom: 2px solid #e5e5e5;
            padding-bottom: 0.5rem;
            margin-bottom: 1.5rem;
        }
        .doc-content h2 {
            margin-top: 2rem;
            margin-bottom: 1rem;
        }
        .doc-content pre {
            background: #f4f4f4;
            padding: 1rem;
            border-radius: 6px;
            overflow-x: auto;
        }
        .back-link {
            display: inline-block;
            margin-bottom: 1rem;
            color: #667eea;
            text-decoration: none;
        }
        .back-link:hover {
            text-decoration: underline;
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <h1 class="logo">Codex CLI</h1>
            <ul class="nav-links">
                <li><a href="../index.html">Home</a></li>
                <li><a href="https://github.com/NovumForum/codex" target="_blank">GitHub</a></li>
            </ul>
        </div>
    </nav>
    
    <div class="container">
        <div class="doc-content">
            <a href="../index.html#docs" class="back-link">← Back to Documentation</a>
            <div id="content"></div>
        </div>
    </div>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; OpenAI. Licensed under the <a href="https://github.com/NovumForum/codex/blob/main/LICENSE">Apache-2.0 License</a>.</p>
        </div>
    </footer>
    
    <script>
        const markdown = \`$(cat "$mdfile" | sed 's/`/\\\\`/g')\`;
        document.getElementById('content').innerHTML = marked.parse(markdown);
    </script>
</body>
</html>
EOF
done

echo "Website build complete!"
echo "Output directory: website/"
