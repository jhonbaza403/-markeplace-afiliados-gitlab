import type { NextConfig } from "next";


const securityHeaders = [

  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },

  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },

  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },

  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },

  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },

  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-site",
  },

  {
    key: "X-Permitted-Cross-Domain-Policies",
    value: "none",
  },

];



const contentSecurityPolicy = `

default-src 'self';

script-src
'self'
'unsafe-inline'
'unsafe-eval';

style-src
'self'
'unsafe-inline';

img-src
'self'
data:
blob:
https:
;

font-src
'self'
data:
https:
;

connect-src
'self'
https://*.supabase.co
wss://*.supabase.co
https:
;

frame-src
'self';

object-src
'none';

base-uri
'self';

form-action
'self';

frame-ancestors
'self';

upgrade-insecure-requests;

`
.replace(/\s{2,}/g, " ")
.trim();



const nextConfig: NextConfig = {


  reactStrictMode:true,


  poweredByHeader:false,


  compress:true,


  productionBrowserSourceMaps:false,


  typescript:{
    ignoreBuildErrors:false,
  },


  experimental:{


    optimizePackageImports:[

      "@supabase/supabase-js",

      "@supabase/ssr",

      "lucide-react",

    ],

  },



  images:{


    formats:[

      "image/avif",

      "image/webp",

    ],


    remotePatterns:[


      {

        protocol:"https",

        hostname:"*.supabase.co",

      },


      {

        protocol:"https",

        hostname:"images.unsplash.com",

      },


    ],


    deviceSizes:[

      320,
      420,
      640,
      750,
      828,
      1080,
      1200,
      1440,
      1920,

    ],


    imageSizes:[

      16,
      32,
      48,
      64,
      96,
      128,
      256,
      384,

    ],

  },



  async headers(){


    return [


      {

        source:"/(.*)",


        headers:[

          ...securityHeaders,


          {

            key:"Content-Security-Policy",

            value:
              contentSecurityPolicy,

          },


        ],

      },



      {


        source:"/_next/static/(.*)",


        headers:[


          {

            key:"Cache-Control",

            value:
            "public, max-age=31536000, immutable",

          },


        ],

      },



      {


        source:"/api/(.*)",


        headers:[


          {

            key:"Cache-Control",

            value:
            "private, no-store",

          },


          {

            key:"X-Content-Type-Options",

            value:"nosniff",

          },


        ],

      },



      {


        source:"/admin/(.*)",


        headers:[


          {

            key:"Cache-Control",

            value:
            "private, no-store",

          },


          {

            key:"X-Frame-Options",

            value:"DENY",

          },


        ],


      },


    ];

  },


};



export default nextConfig;
