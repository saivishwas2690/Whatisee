function previewImage(event) {
    const imagePreview = document.getElementById("imagePreview");
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.src = "";
        imagePreview.style.display = "none";
    }
}

function getCSRFToken() {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    return csrfToken;
}

function formatDescription(description) {
    description = description.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    description = description.replace(/\n/g, "<br>");
    return description;
}

async function submitForm(event) {
    event.preventDefault();
    
    const spinner = document.getElementById("spinner");
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];
    
    if (!file) {
        alert("Please select an image.");
        return;
    }
    
    spinner.style.display = "block";

    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await axios.post("", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "X-CSRFToken": getCSRFToken()
            }
        });

        alert("Image uploaded successfully!");
        console.log(response.data); 


        const description = response.data.description;
        const formattedDescription = formatDescription(description);

        const descriptionContainer = document.createElement("div");
        descriptionContainer.innerHTML = formattedDescription;

        const container = document.querySelector(".container");
        container.appendChild(descriptionContainer); 

    } catch (error) {
        alert("An error occurred while uploading the image.");
        console.error(error);
    } finally {
        spinner.style.display = "none";
    }
}