// export default function tobase64(url, callback){
//     const xhr = new XMLHttpRequest();
//     xhr.onload = function() {
//         const reader = new FileReader();
//         reader.onloadend= function() {
//             callback(reader.result);
//         }
//         reader.readAsDataURL(xhr.response);
//     };
//     xhr.open('GET', url);
//     xhr.responseType = 'blob';
//     xhr.send();
// }


export default function tobase64(url){

    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
        const reader = new FileReader();
        reader.onloadend= function() {
            return reader.result;
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}