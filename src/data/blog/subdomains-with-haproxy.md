---
title: "Subdomains with HAProxy for Node.js and PHP Apps"
pubDatetime: 2015-09-20T00:00:00Z
description: "How to use HAProxy to route multiple apps to clean subdomains — no more sharing links with ugly port numbers."
tags: ["devops", "haproxy", "nodejs", "hosting"]
featured: false
draft: false
---

My setup used to be Apache serving some PHP sites on different sub-domains, like this blog running on WordPress and a little photo-album.

When I started hosting node.js apps, I just put them on different ports. So I would share links like "Check out Pathfinder at sam-the-man.com:3000"… which frankly doesn't really represent the modern web very well, especially as a web-developer. What I really wanted was to put these apps onto different subdomains, but I didn't want Apache to serve them, since node.js is perfectly capable of serving web applications.

I'm trying out HAProxy, which seems to do the job well so far. I have HAProxy listening at port 80, and redirecting traffic to the node.js app at the subdomain `pathfinder.sam-the-man.com`, and all other traffic currently gets sent to Apache which is listening on a different port.

Here are the relevant parts of the HAProxy config file:

```nginx
frontend http-farm
  bind *:80
  mode  http
  option httplog
  acl apache hdr(host) -m beg www.
  acl pathfinder hdr(host) -m beg pathfinder.
  use_backend apache_be if apache
  use_backend pf_be if pathfinder
  default_backend apache_be

backend apache_be
  mode http
  server apache 127.0.0.1:9000

backend pf_be
  mode http
  server pathfinder 127.0.0.1:3000
```

In the configuration file you have to define a "frontend", which is the part that listens on a port and accepts requests, as well as routes those requests to the "backends".

```nginx
  acl apache hdr(host) -m beg www.
  acl pathfinder hdr(host) -m beg pathfinder.
```

We define a few rules in the frontend with the `acl` keyword. The apache rule looks for anything beginning with "www." and the pathfinder rule looks for anything beginning with "pathfinder."

```nginx
  use_backend apache_be if apache
  use_backend pf_be if pathfinder
  default_backend apache_be
```

We then tell it to use the defined backend "apache_be" if the acl rule "apache" is true, or the "pf_be" backend if the "pathfinder" rule applies. If neither applies, we use the "default_backend" as a catch all.

There are of course a lot more options that HAProxy provides — this is just how I decided to initially set it up.
