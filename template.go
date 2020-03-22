package quercia

const template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <div id="__quercia"></div>
  <script id="__QUERCIA_DATA__" type="application/json" crossorigin="anonymous">
    __INSERT_QUERCIA_DATA__
	</script>
	<script>__INSERT_QUERCIA_WEBPACK_RUNTIME__</script>
	<script src="/__quercia/__INSERT_QUERCIA_VENDOR__"></script>
	<script src="/__quercia/__INSERT_QUERCIA_PAGE__"></script>
	<script src="/__quercia/__INSERT_QUERCIA_RUNTIME__"></script>
</body>
</html>
`
