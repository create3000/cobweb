
define ([
	"jquery",
],
function ($)
{
	/*
	 *  Path
	 */

	function Path (path, separator)
	{
		switch (arguments .length)
		{
			case 2:
			{
				this .value                    = path .split (separator);
				this .value .separator         = separator;
				this .value .leadingSeparator  = false;
				this .value .trailingSeparator = false;
				
				if (this .value .length)
				{
					if (this .value [0] === "")
					{
						this .value .shift ();
						this .value .leadingSeparator = true;
					}
				}
				
				if (this .value .length)
				{
					if (this .value [this .value .length - 1] === "")
					{
						this .value .pop ();
						this .value .trailingSeparator = true;
					}		
				}
				
				break;
			}
			case 4:
			{
				this .value                    = arguments [0];
				this .value .separator         = arguments [1];
				this .value .leadingSeparator  = arguments [2];
				this .value .trailingSeparator = arguments [3];					
				break;
			}
		}
	}

	Path .prototype =
	{
		copy: function ()
		{
			return new Path (this .value .slice (0, this .value .length), 
		                    this .value .separator,
		                    this .value .leadingSeparator,
		                    this .value .trailingSeparator);
		},
		get origin ()
		{
			return new Path ([ ], 
		                    this .value .separator,
		                    true,
		                    false);
		},
		get base ()
		{
			if (this .value .trailingSeparator)
				return this .copy ();

			return this .parent;	
		},
		get parent ()
		{
			switch (this .value .length)
			{
				case 0:
				case 1:
				{
					if (this .value .leadingSeparator)
						return this .origin;

					return new Path ([ ".." ], this .value .separator, false, false);
				}

				default:
					return new Path (this .value .slice (0, this .value .length - 1), 
				                    this .value .separator,
				                    this .value .leadingSeparator,
				                    true);
			}

		},
		getRelativePath: function (descendant)
		{
			var path = new Path ([ ], "/", false, false);

			var basePath       = this .removeDotSegments () .base;
			var descendantPath = descendant .removeDotSegments ();

			var i, j;

			for (i = 0; i < basePath .value .length && i < descendantPath .value .length; ++ i)
			{
				if (basePath .value [i] !== descendantPath .value [i])
					break;
			}

			for (j = i; j < basePath .value .length; ++ j)
				path .value .push ("..");

			for (j = i; j < descendantPath .value .length; ++ j)
				path .value .push (descendantPath .value [j]);

			return path;
		},
		removeDotSegments: function ()
		{
			var path = new Path ([ ], this .value .separator, this .value .leadingSeparator, this .value .trailingSeparator);

			if (this .value .length)
			{
				for (var i = 0; i < this .value .length; ++ i)
				{
					var segment = this .value [i];
				
					if (segment .length === 0)
						;

					else if (segment === ".")
						path .value .trailingSeparator = true;

					else if (segment === "..")
					{
						path .value .trailingSeparator = true;

						if (path .value .length)
							path .value .pop ();
					}

					else
					{
						path .value .trailingSeparator = false;
						path .value .push (segment);
					}
				}

				path .value .trailingSeparator |= this .value .trailingSeparator;
			}

			return path;
		},
		toString: function ()
		{
			var string = "";
		
			if (this .value .leadingSeparator)
				string += this .value .separator;

			string += this .value .join (this .value .separator);

			if (this .value .trailingSeparator)
				string += this .value .separator;

			return string;
		},
	};

	/*
	 *  URI
	 */

	var wellKnownPorts =
	{
		ftp:   21,
		http:  80,
		https: 443,
		ftps:  990,
	};

	var address   = /^(?:([^:\/?#]*?):)?(?:(\/\/)([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?$/;
	var authority = /^(.*?)(?:\:([^:]*))?$/;

	function parse (uri, string)
	{
		var result = address .exec (string);
	
		if (result)
		{
			uri .scheme    = result [1] || "";
			uri .slashs    = result [2] || "";
			uri .authority = result [3] || "";
			uri .path      = result [4] || "";
			uri .query     = result [5] || "";
			uri .fragment  = result [6] || "";
			
			var result = authority .exec (uri .authority);
			
			if (result)
			{
				uri .host      = result [1] || "";
				uri .port      = result [2] ? parseInt (result [2]) : 0;
				uri .authority = uri .host;

				if (uri .port)
					uri .authority += ":" + uri .port;
			}
			
			uri .absolute = Boolean (uri .slashs .length) || uri .path [0] === "/";
			uri .local    = /^(?:file|data)$/ .test (uri .scheme) || (! uri .scheme && ! uri .authority)
		}

		uri .string = string;
	}

	function removeDotSegments (path)
	{
		return new Path (path, "/") .removeDotSegments () .toString ();
	}

	function URI (uri)
	{
		this .value =
		{
			local:     true,
			absolute:  true,
			scheme:    "",
			slashs:    "",
			authority: "",
			host:      "",
			port:      0,
			path:      "",
			query:     "",
			fragment:  "",
			string:    "",
		};

		switch (arguments .length)
		{
			case 0:
				break;
			case 1:
			{
				parse (this .value, uri);
				break;
			}
			case 10:
			{
				this .value .local     = arguments [0];
				this .value .absolute  = arguments [1];
				this .value .scheme    = arguments [2];
				this .value .slashs    = arguments [3];
				this .value .authority = arguments [4];
				this .value .host      = arguments [5];
				this .value .port      = arguments [6];
				this .value .path      = arguments [7];
				this .value .query     = arguments [8];
				this .value .fragment  = arguments [9];
				this .value .string    = this .toString ();
				break;
			}
		}
	};

	URI .prototype =
	{
		copy: function ()
		{
			return new URI (this .value .local,
			                this .value .absolute,
			                this .value .scheme,
			                this .value .slashs,
			                this .value .authority,
			                this .value .host,
			                this .value .port,
			                this .value .path,
			                this .value .query,
			                this .value .fragment);
		},
		get length ()
		{
			return this .value .string .length;
		},
		isRelative: function ()
		{
			return ! this .value .absolute ();
		},
		isAbsolute: function ()
		{
			return ! this .value .absolute;
		},
		isLocal: function ()
		{
			return this .value .local;
		},
		isNetwork: function ()
		{
			return ! this .value .local;
		},
		isDirectory: function ()
		{
			return this .value .path .length && this .value .path [this .value .path .length - 1] === "/";
		},
		isFile: function ()
		{
			return ! this .isDirectory ();
		},
		get hierarchy ()
		{
			var hierarchy = "";

			hierarchy += this .value .slashs;
			hierarchy += this .value .authority;
			hierarchy += this .value .path;

			return hierarchy;
		},
		get authority ()
		{
			return this .value .authority;
		},
		get scheme ()
		{
			return this .value .scheme;
		},
		get host ()
		{
			return this .value .host;
		},
		get port ()
		{
			return this .value .port;
		},
		get wellKnownPort ()
		{
			var wellKnownPort = wellKnownPorts [this .value .scheme];

			if (wellKnownPort !== undefined)
				return wellKnownPort;

			return 0;
		},
		get path ()
		{
			return this .value .path;
		},
		set query (value)
		{
			this .value .query = value;
		},
		get query ()
		{
			return this .value .query;
		},
		set fragment (value)
		{
			this .value .fragment = value;
		},
		get fragment ()
		{
			return this .value .fragment;
		},
		get location ()
		{
			return this .toString ();
		},
		get origin ()
		{
			return new URI (this .value .local,
			                this .value .absolute,
			                this .value .scheme,
			                this .value .slashs,
			                this .value .authority,
			                this .value .host,
			                this .value .port,
			                this .value .local ? "/" : "",
			                "",
			                "");
		},
		get base ()
		{
			if (this .isDirectory ())
				return new URI (this .value .local,
				                this .value .absolute,
				                this .value .scheme,
				                this .value .slashs,
				                this .value .authority,
				                this .value .host,
				                this .value .port,
				                this .value .path,
				                "",
				                "");

			return this .parent;
		},
		get parent ()
		{
			var path;
			
			if (this .isDirectory ())
			{
				if (this .value .path .length == 1)
					return "/";

				path = this .value .path .substr (0, this .value .path .length - 1);
			}
			else
				path = this .path;

			var slash = path .lastIndexOf ("/");
			
			path = slash == -1 ? "" : path .substring (0, path .lastIndexOf ("/") + 1);

			return new URI (this .value .local,
			                this .value .absolute,
			                this .value .scheme,
			                this .value .slashs,
			                this .value .authority,
			                this .value .host,
			                this .value .port,
			                path,
			                "",
			                "");	
		},
		get filename ()
		{
			return new URI (this .value .local,
			                this .value .absolute,
			                this .value .scheme,
			                this .value .slashs,
			                this .value .authority,
			                this .value .host,
			                this .value .port,
			                this .value .path,
			                "",
			                "");
		},
		get basename ()
		{
			if (this .value .path)
				return this .value .path .substr (this .value .path. lastIndexOf ("/") + 1);

			return "";
		},
		get prefix ()
		{
			if (this .value .path .length && this .isFile ())
			{
				var basename = this .basename;
				var suffix   = this .suffix;

				return basename .substr (0, basename .length - suffix .length);
			}

			return this .basename;
		},
		get suffix ()
		{
			var dot   = this .value .path .lastIndexOf (".");
			var slash = this .value .path .lastIndexOf ("/");

			if (slash < dot)
				return this .value .path .substr (dot);

			return "";
		},
		transform: function (reference)
		{
			var T_local    = false;
			var T_absolute = false;

			var T_scheme    = "";
			var T_slashs    = "";
			var T_authority = "";
			var T_host      = "";
			var T_port      = 0;
			var T_path      = "";
			var T_query     = "";
			var T_fragment  = "";

			if (reference .scheme .length)
			{
				T_local     = reference .isLocal ();
				T_absolute  = reference .isAbsolute ();
				T_scheme    = reference .scheme;
				T_slashs    = reference .value .slashs;
				T_authority = reference .authority;
				T_host      = reference .host;
				T_port      = reference .port;
				T_path      = reference .path;
				T_query     = reference .query;
			}
			else
			{
				if (reference .authority .length)
				{
					T_local     = reference .isLocal ();
					T_absolute  = reference .isAbsolute ();
					T_authority = reference .authority;
					T_host      = reference .host;
					T_port      = reference .port;
					T_path      = reference .path;
					T_query     = reference .query;
				}
				else
				{
					if (reference .path .length === 0)
					{
						var T_path = this .value .path;

						if (reference .query .length)
							T_query = reference .query;
						else
							T_query = this .value .query;
					}
					else
					{
						if (reference .path [0] === "/")
						{
							T_path = reference .path;
						}
						else
						{
							// merge (Base .path (), reference .path ());

							var base = this .base;

							if (base .path .length === 0)
								T_path = "/";
							else
								T_path += base .path;

							T_path += reference .path;
						}

						T_query = reference .query;
					}

					T_local     = this .isLocal ();
					T_absolute  = this .isAbsolute () || reference .isAbsolute ();
					T_authority = this .value .authority;
					T_host      = this .value .host;
					T_port      = this .value .port;
				}

				T_scheme = this .value .scheme;
				T_slashs = this .value .slashs;
			}

			T_fragment = reference .fragment;

			return new URI (T_local,
			                T_absolute,
			                T_scheme,
			                T_slashs,
			                T_authority,
			                T_host,
			                T_port,
			                removeDotSegments (T_path),
			                T_query,
			                T_fragment);
		},
		removeDotSegments: function ()
		{
			return new URI (this .value .local,
			                this .value .absolute,
			                this .value .scheme,
			                this .value .slashs,
			                this .value .authority,
			                this .value .host,
			                this .value .port,
			                removeDotSegments (this .value .path),
			                this .value .query,
			                this .value .fragment);
		},
		getRelativePath: function (descendant)
		{
			if (this .value .scheme !== descendant .scheme)
				return descendant;

			if (this .value .authority !== descendant .authority)
				return descendant;

			var path           = new Path (this .value .path, "/");
			var descendantPath = new Path (descendant .path,  "/");

			return new URI (true,
			                false,
			                "",
			                "",
			                "",
			                "",
			                0,
			                path .getRelativePath (descendantPath) .toString (),
			                descendant .query,
			                descendant .fragment);
		},
		escape: function ()
		{
			return new URI (escape (this .location));
		},
		unescape: function ()
		{
			return new URI (unescape (this .location));	
		},
		toString: function ()
		{
			var string = this .value .scheme;

			if (this .value .scheme .length)
				string += ":";

			string += this .hierarchy;

			if (this .value .query .length)
				string += "?" + this .value .query;

			if (this .value .fragment .length)
				string += "#" + this .value .fragment;

			return string;
		},
	};

	return URI;
});
