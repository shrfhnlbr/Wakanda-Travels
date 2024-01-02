(function ($) {
  "use strict";

  // Spinner
  (function spinner() {
    setTimeout(() => {
      $("#spinner").filter(":visible").removeClass("show");
    }, 1);
  })();

  // Initiate the wowjs
  new WOW().init();

  // Sticky Navbar
$(window).scroll(function () {
  $(".navbar").toggleClass("sticky-top shadow-sm", $(this).scrollTop() > 45);
});

  // Dropdown on mouse hover
const $dropdown = $(".dropdown");
const $dropdownToggle = $(".dropdown-toggle");
const $dropdownMenu = $(".dropdown-menu");
const showClass = "show";

$dropdown.hover(
  function () {
    const $this = $(this);
    if (window.matchMedia("(min-width: 992px)").matches) {
      $this.addClass(showClass);
      $this.find($dropdownToggle).attr("aria-expanded", "true");
      $this.find($dropdownMenu).addClass(showClass);
    }
  },
  function () {
    const $this = $(this);
    if (window.matchMedia("(min-width: 992px)").matches) {
      $this.removeClass(showClass);
      $this.find($dropdownToggle).attr("aria-expanded", "false");
      $this.find($dropdownMenu).removeClass(showClass);
    }
  }
);

  // Back to top button
$(window).scroll(function () {
  $(".back-to-top").toggle($(this).scrollTop() > 300);
});

$(".back-to-top").click(function () {
  $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
  return false;
});

  // Testimonials carousel configuration
  var testimonialsCarouselConfig = {
    autoplay: true,
    smartSpeed: 1000,
    center: true,
    margin: 24,
    dots: true,
    loop: true,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
  };

  // Initialize the testimonials carousel
  $(".testimonial-carousel").owlCarousel(testimonialsCarouselConfig);
})(jQuery);

const baseURL = "https://Wakanda-Travels-backend.onrender.com/api/v1";

const fetchDestinations = async (countryCode) => {
  try {
    console.log(countryCode);
    const response = await fetch(
      `${baseURL}/places/destinations?country_code=${countryCode}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching data. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error in fetchDestinations: ${error.message}`);
    throw error; // Re-throw the error for the calling code to handle
  }
};

const fetchSingleDestinations = async (id) => {
  try {
    const response = await fetch(`${baseURL}/places/destinations/${id}`);

    if (!response.ok) {
      throw new Error(`Error fetching data. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error in fetchSingleDestinations: ${error.message}`);
    throw error; // Re-throw the error for the calling code to handle
  }
};

const getCountries = async () => {
  try {
    const response = await fetch(`${baseURL}/places/countries`);

    if (!response.ok) {
      throw new Error(`Error fetching data. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error in getCountries: ${error.message}`);
    throw error; // Re-throw the error for the calling code to handle
  }
};

// Get Country Drop Down
const country = document.getElementById("country-dropdown");
country.addEventListener("click", async () => {
  try {
    const { data } = await getCountries();

    data.forEach((element) => {
      const option = document.createElement("option");
      option.value = element.country_code;
      option.appendChild(document.createTextNode(element.country_name));
      country.appendChild(option);
    });
  } catch (error) {
    console.error(`Error in country dropdown: ${error.message}`);
  }
});

// Get Search Destination
const destinations = document.getElementById("search-destination");

destinations.addEventListener("click", async (e) => {
  try {
    const selectValue = e.target.previousElementSibling.value;
    const { data } = await fetchDestinations(selectValue);

    const mainSearchClass = document.getElementById("search-result-main");
    mainSearchClass.style.display = "initial";

    const searchResult = document.getElementById("search-result");
    searchResult.innerHTML = data.features.map((element) => {
      const starText = Array.from({ length: element.properties.rate }, () => `<small class="fa fa-star text-primary"></small>`).join('');

      return `
        <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
          <div class="package-item">
            <div class="text-center p-4">
              <h3 class="mb-0">${element.properties.name}</h3>
              <div class="mb-3">${starText}</div>
              <div class="d-flex justify-content-center mb-2">
                <button data-id="${element.properties.xid}" class="btn btn-sm btn-primary px-3 border-end openModalBtn" style="border-radius: 30px;">Read More</button>
              </div>
            </div>
          </div>
        </div>`;
    }).join('');
  } catch (error) {
    console.error(`Error in search destination: ${error.message}`);
  }
});

var modal = document.getElementById("myModal");
var openModalBtns = document.querySelectorAll(".openModalBtn");
var closeModalBtn = document.querySelector(".close");

closeModalBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

openModalBtns.forEach(function (btn) {
  btn.addEventListener("click", async function (e) {
    const id = e.target.getAttribute("data-id");
    const { data } = await fetchSingleDestinations(id);
    modal.style.display = "block";

    let starText = Array.from({ length: parseInt(data.rate) }, () => '<small class="fa fa-star text-primary"></small>').join('');
  });
});

modal.innerHTML = `
  <div class="modal-content" style="background-color: black; color: black !important">
    <div class="sub-modal-content">
      <span class="close">&times;</span>
    </div>
    <div class="col-lg-12 col-md-10 wow fadeInUp" data-wow-delay="0.1s">
      <div class="package-item">
        <div class="d-flex border-bottom">
          <small class="flex-fill text-center border-end py-2 modal-city">${data.address.city}</small>
          <small class="flex-fill text-center border-end py-2 modal-state">${data.address.state}</small>
          <small class="flex-fill text-center py-2 modal-country">${data.address.country}</small>
        </div>
        <div class="text-center p-4">
          <h3 class="mb-0">${data.name}</h3>
          <div class="mb-3">
            ${Array.from({ length: parseInt(data.rate) }, () => '<small class="fa fa-star text-primary"></small>').join('')}
          </div>
          <p class="modal-description">${data.wikipedia_extracts.text}</p>
          <div class="d-flex justify-content-center mb-2">
            <!-- <a href="#" class="btn btn-sm btn-primary px-3 modal-review border-end"
              style="border-radius: 30px 0 0 30px;">Reviews</a> -->
            <a href="./booking.html" class="btn btn-sm btn-primary px-3 modal-book"
              style="border-radius: 30px;">Book Now</a>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
};
  });

const togglePasswordVisibility = () => {
  const passwordField = document.getElementById("passwordField");
  passwordField.type = passwordField.type === "password" ? "text" : "password";
};

window.addEventListener("load", () => {
  const username = localStorage.getItem("username");
  if (username) {
    const registerBtn = document.getElementById("major-check");
    registerBtn.innerHTML = username;
  }
});

