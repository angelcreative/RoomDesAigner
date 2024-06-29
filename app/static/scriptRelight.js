document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');
    const promptInput = document.getElementById('promptInput');
    formData.append('file', fileInput.files[0]);
    formData.append('prompt', promptInput.value);
    
    const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();
    if (result.relighted_image_url) {
        showRelightedImage(result.relighted_image_url);
    } else {
        alert('Image relighting failed: ' + result.error);
    }
});

function showRelightedImage(imageUrl) {
    const modal = document.getElementById('resultModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageUrl;
    modal.style.display = 'block';
}

document.getElementById('closeModal').addEventListener('click', () => {
    const modal = document.getElementById('resultModal');
    modal.style.display = 'none';
});
