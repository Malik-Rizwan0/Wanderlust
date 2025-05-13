// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()



  const filters = document.querySelector(".filters");
let isDown = false;
let startX;
let scrollLeft;

filters.addEventListener("mousedown", (e) => {
  isDown = true;
  filters.classList.add("active");
  startX = e.pageX - filters.offsetLeft;
  scrollLeft = filters.scrollLeft;
});

filters.addEventListener("mouseleave", () => {
  isDown = false;
  filters.classList.remove("active");
});

filters.addEventListener("mouseup", () => {
  isDown = false;
  filters.classList.remove("active");
});

filters.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - filters.offsetLeft;
  const walk = (x - startX) * 1; //scroll-fast
  filters.scrollLeft = scrollLeft - walk;
});

let taxSwitch = document.querySelector("#taxSwitch");
taxSwitch.addEventListener("click", function() {
  let taxinfo = document.getElementsByClassName("taxRate");
  for(taxinfo of taxinfo) {
    if (taxSwitch.checked) {
      taxinfo.style.display = "inline";
    } else {
      taxinfo.style.display = "none";
    }
  }
});