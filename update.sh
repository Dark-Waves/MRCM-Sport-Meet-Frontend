#!/bin/bash

# Function to display a progress bar
progress_bar() {
    local duration=$1
    local max_blocks=50
    local elapsed_blocks=0
    local start_time=$(date +%s)
    local end_time=$((start_time + duration))
    local current_time=$start_time
    local progress

    while [[ $current_time -lt $end_time ]]; do
        progress=$((100 * (current_time - start_time) / (end_time - start_time)))
        local elapsed_blocks=$((progress * max_blocks / 100))
        local remaining_blocks=$((max_blocks - elapsed_blocks))
        printf "\r["
        printf "%${elapsed_blocks}s" | tr ' ' '#'
        printf "%${remaining_blocks}s" | tr ' ' '-'
        printf "] %d%%" "$progress"
        sleep 1
        current_time=$(date +%s)
    done
    echo ""
}

# Parse command-line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -id|--id) ID="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

# Validate ID
if [[ -z $ID ]]; then
    echo "ID is required. Usage: ./update.sh --id <ID>"
    exit 1
fi

# Determine directory path based on ID
case $ID in
    0)
        DIRECTORY="/home/ninoko/Documents/MRCM-Sport-Meet-Backend"
        Name="MRCM-SPORT-MEET-BACKEND"
        ;;
    1)
        DIRECTORY="/home/ninoko/Documents/MRCM-Sport-Meet-Frontend"
        Name="MRCM-SPORT-MEET-FRONTEND"
        ;;
    *)
        echo "Invalid ID. Supported IDs are 0 (Backend) and 1 (Frontend)."
        exit 1
        ;;
esac

# Navigate to the git repository directory
cd "$DIRECTORY" || { echo "Directory not found: $DIRECTORY"; exit 1; }

# Display status message
echo "Updating and building for ID $ID..."

# Stash any changes
git stash &>/dev/null
echo "Stashing changes..."

# Pull the latest changes from the remote repository
git pull &>/dev/null
echo "Pulling latest changes..."

# Install npm update
npm install --force &>/dev/null
echo "Installing npm packages..."

# Remove the 'dist' directory if it exists
rm -rf dist &>/dev/null
echo "Removing 'dist' directory..."

# Build the project and start
echo "Building project... and starting server..."
npm run preview

# Display a message indicating the update and build process is complete
echo "Update and build process complete for ID $ID"

# PM2 Command --> pm2 start "cd /home/vps3/MRCM-Sport-Meet-Frontend && ./update.sh --id 2" --name "MRCM-SPORT-MEET-FRONTEND"