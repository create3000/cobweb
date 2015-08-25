
define ([
	"jquery",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
	"opentype",
],
function ($,
          X3DNode, 
          X3DConstants,
          opentype)
{
	var i = 0;

	var Alignment =
	{
	   BEGIN:  ++ i,
	   FIRST:  ++ i,
	   MIDDLE: ++ i,
	   END:    ++ i,
	};

	function X3DFontStyleNode (browser, executionContext)
	{
		X3DNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DFontStyleNode);

		this .alignments = [ ];
	}

	X3DFontStyleNode .prototype = $.extend (Object .create (X3DNode .prototype),
	{
		constructor: X3DFontStyleNode,
		initialize: function ()
		{
		   X3DNode .prototype .initialize .call (this);

		   this .style_   .addInterest (this, "set_style__");
		   this .justify_ .addInterest (this, "set_justify__");

			this .font = null;

		   this .set_style__ ();
		   this .set_justify__ ();
		   this .requestAsyncLoad ();
		},
		getMajorAlignment: function ()
		{
			return this .alignments [0];
		},
		getMinorAlignment: function ()
		{
			return this .alignments [1];
		},
		set_style__: function ()
		{
		   var style = this .style_ .getValue ();

			this .italic = (style == "ITALIC" || style == "BOLDITALIC");
			this .bold   = (style == "BOLD"   || style == "BOLDITALIC");
		},
		set_justify__: function ()
		{
			var majorNormal = this .horizontal_ .getValue () ? this .leftToRight_ .getValue () : this .topToBottom_ .getValue ();

			this .alignments [0] = this .justify_ .length > 0
			                       ? this .getAlignment (0, majorNormal)
								        : majorNormal ? Alignment .BEGIN : Alignment .END;

			var minorNormal = this .horizontal_ .getValue () ? this .topToBottom_ .getValue () : this .leftToRight_ .getValue ();

			this .alignments [1] = this .justify_ .length > 1
			                       ? this .getAlignment (1, minorNormal)
								        : minorNormal ? Alignment .FIRST : Alignment .END;
		},
		getAlignment: function (index, normal)
		{
			if (normal)
			{
				// Return for west-european normal alignment.

				switch (this .justify_ [index])
				{
					case "FIRST":  return Alignment .FIRST;
					case "BEGIN":  return Alignment .BEGIN;
					case "MIDDLE": return Alignment .MIDDLE;
					case "END":    return Alignment .END;
				}
			}
			else
			{
				// Return appropriate alignment if topToBottom or leftToRight are FALSE.

				switch (this .justify_ [index])
				{
					case "FIRST":  return Alignment .END;
					case "BEGIN":  return Alignment .END;
					case "MIDDLE": return Alignment .MIDDLE;
					case "END":    return Alignment .BEGIN;
				}
			}

			return index ? Alignment .FIRST : Alignment .BEGIN;
		},
		requestAsyncLoad: function ()
		{
			try
			{
				opentype .load ("fonts/Ubuntu-R.ttf", this .setFont .bind (this));
			}
			catch (error)
			{
				this .setError (error .message);
			}
		},
		setFont: function (error, font)
		{
			if (error)
			{
			   this .setError (error);
			}
			else
			{
				console .log ('Font loaded fine.');

				this .font = font;
		   
		      // Workaround to initialize composite glyphs.
		      for (var i = 0; i < this .font .numGlyphs; ++ i)
					this .font .glyphs .get (i) .getPath (0, 0, 1);

				this .addNodeEvent ();
			}
		},
		getFont: function ()
		{
		   return this .font;
		},
		setError: function (error)
		{
			this .font = null;

			console .warn ('Font could not be loaded: ' + error);			   
		},
	});

	X3DFontStyleNode .Alignment = Alignment;

	return X3DFontStyleNode;
});

