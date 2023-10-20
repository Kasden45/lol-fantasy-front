<template>
    <div class="container">
      <div class="row gy-3">
        <div class="col-12 col-sm-6 col-md-3 text-sm-start">
          <h5 class="mb-2 mb-sm-4 fw-bolder">Our company</h5>
          <ul>
            <li><a href="javascript:">About us</a></li>
            <li><a href="javascript:">Jobs</a></li>
            <li><a href="javascript:">Press</a></li>
            <li><a href="javascript:">Collaboration</a></li>
          </ul>
        </div>
        <div class="col-12 col-sm-6 col-md-3 text-sm-start">
          <h5 class="mb-2 mb-sm-4 fw-bolder">Info</h5>
          <ul>
            <li><a href="javascript:">News</a></li>
            <li><a href="javascript:">Security</a></li>
            <li><a href="javascript:">Legal</a></li>
          </ul>
        </div>
        <div class="col-12 col-sm-6 col-md-3 text-sm-start">
          <h5 class="mb-2 mb-sm-4 fw-bolder">Support</h5>
          <ul>
            <li><a href="javascript:">JD</a></li>
            <li><a href="javascript:">FAQ</a></li>
            <li><a href="javascript:">Terms and conditions</a></li>
          </ul>
        </div>
        <div class="col-12 col-sm-6 col-md-3 text-sm-start">
          <h5 class="mb-2 mb-sm-4 fw-bolder">Contact</h5>
          <ul>
            <li><span>12333 West Olympic Blvd.
Los Angeles, CA 90064
United States</span></li>
            <li><span>kontakt@2kpi.2kpi</span></li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <a href="javascript:" class="mx-4">
            <font-awesome-icon
              :icon="['fa-brands', 'facebook']"
              class="social-icon"
              size="lg"
            />
          </a>
          <a href="javascript:" class="mx-4">
            <font-awesome-icon
              :icon="['fa-brands', 'instagram']"
              class="social-icon"
              size="lg"
            />
          </a>
          <a href="javascript:" class="mx-4">
            <font-awesome-icon
              :icon="['fa-brands', 'tiktok']"
              class="social-icon"
              size="lg"
            />
          </a>
          <a href="javascript:" class="mx-4">
            <font-awesome-icon
              :icon="['fa-brands', 'youtube']"
              class="social-icon"
              size="lg"
            />
          </a>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "SiteFooter",
  };
  </script>
  
  <style scoped>
  * {
    color: white;
  }
  
  ul {
    padding-left: 0;
    list-style: none;
  }
  
  li {
    padding-bottom: 0.5rem;
  }
  
  li a {
    text-decoration: none;
  }
  
  li a:hover,
  .social-icon:hover {
    color: var(--PRIMARY-LIGHTER);
  }
  </style>