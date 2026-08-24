<template>
  <h4 class="user-guide-header mt-5">
    Technical Note
  </h4>
  <p>
    This tool can match potential targets to Roman's field of view, but it is <strong>NOT meant to be used as a precision tool</strong> for planning science observations. WWT's all-sky backgrounds may have small position offsets of 2-3".
  </p>
  <v-row>
    <v-col cols="12">
      <h4 class="user-guide-header">
        Controls
      </h4>
      <ul class="text-list mx-5">
        <li>
          <strong>Select Background</strong>: Choose from DSS, 2MASS, SDSS, or unWISE.
        </li>
        <li>
          <strong>Footprint Color</strong>: Adjust as needed to contrast against the background.
        </li>
        <li>
          <strong>Crosshairs</strong>: Show location reported in RA/Dec display and adjust color as needed.
        </li>                           
        <li>
          <strong>Fill</strong>: Fill in footprint squares and adjust opacity.
        </li>                        
        <li>
          <strong>Decimal coordinates</strong>: Display RA/Dec as decimals.
        </li>   
        <li>
          <strong>Galactic mode</strong>: rotate WWT view to follow galactic plane.
        </li>
        <li>
          <font-awesome-icon
            class="bullet-icon"
            icon="info"
            size="lg" 
          ></font-awesome-icon>
          View this documentation
        </li>
        <li>
          <font-awesome-icon
            class="bullet-icon"
            icon="share-nodes"
            size="lg" 
          ></font-awesome-icon>
          Get link to share current view. Url will be copied to clipboard and can be pasted in browser.
        </li>       
      </ul>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <h4 class="user-guide-header">
        Go to
      </h4>
      <ul class="text-list mx-5">
        <li>
          <strong>Object Name</strong>: Use SIMBAD search to resolve object names.
        </li>
        <p style="color: var(--border-color)">
          <strong>or</strong>
        </p>
        <li>
          <strong>RA</strong>: Right Ascension entered in sexagesimal format (00h00m00s, 00:00:00, or 00 00 00) will be interpreted as hours. Decimal format will be interpreted as degrees.
        </li>
        <li>
          <strong>Dec</strong>: Declination can be entered in sexagesimal format (00&deg;00'00", 00:00:00, or 00 00 00) or in decimal format.
        </li>                                 
      </ul>
    </v-col>
  </v-row>
</templatE>