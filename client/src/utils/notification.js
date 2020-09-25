export default function(msg, color) {
    notification = true;
    notificationMessage = { msg, color };
    setTimeout(() => notification = false, 3000);
}