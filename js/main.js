if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  navigator.serviceWorker.register('sw.js')
}


// fetch('http://localhost:8000/html/pwa/data.json')
// .then(response => {
//   return response.json()
// }).then(function(json) {
//   let element = document.querySelector('#data')
//   element.innerHTML = JSON.stringify(json)
// })