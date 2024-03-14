// console.log(Html5QrcodeScanner)
const bDiv = document.getElementById("body")
const sDiv = document.getElementById("scanner")
const rDiv = document.getElementById('result')

const SCANNER = new  Html5QrcodeScanner('scanner', {
    qrbox: {
        width: 300,
        height: 300,
    },
    fps: 20,
}) 

SCANNER.render(success, error)

function success(res){
    console.log(res)
    bDiv.innerHTML = `
    <h1>Scanned!<h1>
    `
    // <p>This is the scanned data: </p>
    // <p>${res}</p>


    SCANNER.clear()
    document.getElementById('scanner').remove()

    TIME_IN(res)
}

function error(res){
    // console.log(res)
    console.error(res)
}

async function TIME_IN(data){
    rDiv.innerHTML = `<h1>Verifying<h1>`
    await fetch("http://192.168.100.4:6969/tracker/time-in", {
    method: "POST",
    body: data,
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
})
  .then((response) => response.json())
  .then((status) => rDiv.innerHTML = `
  <h1>Verified!<h1>
  <p>${status.status_res}</p>`
);
}