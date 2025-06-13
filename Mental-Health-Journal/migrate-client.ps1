# Create necessary directories
New-Item -ItemType Directory -Path ".\client-new\src\components\auth" -Force
New-Item -ItemType Directory -Path ".\client-new\src\pages" -Force
New-Item -ItemType Directory -Path ".\client-new\src\utils" -Force

# Copy source files
Copy-Item -Path ".\client\src\components\auth\*" -Destination ".\client-new\src\components\auth\" -Recurse -Force
Copy-Item -Path ".\client\src\pages\*" -Destination ".\client-new\src\pages\" -Recurse -Force
Copy-Item -Path ".\client\src\utils\*" -Destination ".\client-new\src\utils\" -Recurse -Force
Copy-Item -Path ".\client\src\App.js" -Destination ".\client-new\src\" -Force
Copy-Item -Path ".\client\src\App.css" -Destination ".\client-new\src\" -Force
Copy-Item -Path ".\client\src\index.js" -Destination ".\client-new\src\" -Force
Copy-Item -Path ".\client\src\index.css" -Destination ".\client-new\src\" -Force

Write-Host "Migration complete! Your files have been copied to the new React app."
