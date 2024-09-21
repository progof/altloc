server {
        listen 80;
        listen [::]:80;

        root /usr/share/nginx/html;
        index index.html;

        server_name altloc.com www.altloc.com;

        location / {
                try_files $uri $uri/ =404;
        }
}