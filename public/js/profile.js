let currentAvatar = frame.src

function preview() {
    try {
        frame.src = URL.createObjectURL(event.target.files[0]);
    } catch (error) {
        clearImage();
    }
}

function clearImage() {
    document.getElementById('inputAvatar').value = null;
    frame.src = currentAvatar;
}

$(() => {
    const url = window.location.href;
    if (url.indexOf("#changePassword") !== -1) {
        $("#navAccountDetails").removeClass("active");
        $("#navChangePassword").addClass("active");
        $("#changePassword").addClass("active").addClass("show");
        $("#accountDetails").removeClass("active").removeClass("show");
    }
})