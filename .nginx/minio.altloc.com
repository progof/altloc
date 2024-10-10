server {
    listen 80;
    listen [::]:80;
    server_name minio.altloc.com www.minio.altloc.com;

    # Allow special characters in headers
    #ignore_invalid_headers off;
    # Allow any size file to be uploaded.
    # Set to a value such as 1000m; to restrict file size to a specific value
    #client_max_body_size 0;
    # Disable buffering
    #proxy_buffering off;
    #proxy_request_buffering off;

    root /usr/share/nginx/html;
    index index.html;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://minio:9090/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}