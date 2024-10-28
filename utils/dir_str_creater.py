import os

def print_directory_structure(startpath, exclude_dirs=None, indent=''):
    if exclude_dirs is None:
        exclude_dirs = ['myenv', '__pycache__']
    
    # Get list of items in directory
    try:
        items = os.listdir(startpath)
    except PermissionError:
        return

    # Sort items to show directories first, then files
    items.sort(key=lambda x: (not os.path.isdir(os.path.join(startpath, x)), x))
    
    for item in items:
        path = os.path.join(startpath, item)
        
        # Skip excluded directories
        if os.path.isdir(path) and item in exclude_dirs:
            continue
            
        if os.path.isdir(path):
            print(f'{indent}📁 {item}')
            print_directory_structure(path, exclude_dirs, indent + '  ')
        else:
            print(f'{indent}📄 {item}')

if __name__ == '__main__':
    # You can modify the start path and excluded directories here
    start_path = '.'  # Current directory
    excluded_directories = ['myenv', 'node_modules', '__pycache__', '.git']  # Added .git
    
    print('Directory Structure:')
    print_directory_structure(start_path, excluded_directories)
