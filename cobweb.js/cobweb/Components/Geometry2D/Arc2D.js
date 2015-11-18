
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Complex",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Algorithm",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometryNode, 
          X3DConstants,
          Complex,
          Vector3,
          Algorithm)
{
"use strict";

	function Arc2D (executionContext)
	{
		X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .Arc2D);
	}

	Arc2D .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
	{
		constructor: Arc2D,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",   new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "startAngle", new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "endAngle",   new Fields .SFFloat (1.5708)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "radius",     new Fields .SFFloat (1)),
		]),
		getTypeName: function ()
		{
			return "Arc2D";
		},
		getComponentName: function ()
		{
			return "Geometry2D";
		},
		getContainerField: function ()
		{
			return "geometry";
		},
		set_live__: function ()
		{
			X3DGeometryNode .prototype .set_live__ .call (this);

			if (this .getExecutionContext () .isLive () .getValue () && this .isLive () .getValue ())
				this .getBrowser () .getConeOptions () .addInterest (this, "eventsProcessed");
			else
				this .getBrowser () .getConeOptions () .removeInterest (this, "eventsProcessed");
		},
		isLineGeometry: function ()
		{
			return true;
		},
		getAngle: function ()
		{
			var
				start = Algorithm .interval (this .startAngle_ .getValue (), 0, Math .PI * 2),
				end   = Algorithm .interval (this .endAngle_   .getValue (), 0, Math .PI * 2);
		
			if (start === end)
				return Math .PI * 2;
		
			var difference = Math .abs (end - start);
		
			if (start > end)
				return (Math .PI * 2) - difference;
		
			if (! isNaN (difference))
				return difference;
			
			// We must test for NAN, as NAN to int is undefined.
			return 0;
		},
		build: function ()
		{
			var
				gl         = this .getBrowser () .getContext (),
				options    = this .getBrowser () .getArc2DOptions (),
				minAngle   = options .minAngle_ .getValue (),
				startAngle = this .startAngle_ .getValue  (),
				radius     = Math .abs (this .radius_ .getValue ()),
				difference = this .getAngle (),
				segments   = Math .ceil (difference / options .minAngle_ .getValue ()),
				angle      = difference / segments,
				vertices   = this .getVertices ();

			if (difference < (Math .PI * 2))
			{
				++ segments;
				this .primitiveMode = gl .LINE_STRIP;
			}
			else
				this .primitiveMode = gl .LINE_LOOP;

			for (var n = 0; n < segments; ++ n)
			{
				var
					theta = startAngle + angle * n,
					point = Complex .Polar (radius, theta);
		
				vertices .push (point .real, point .imag, 0, 1);
			}

			this .setVertices (vertices);
			this .setExtents  ([new Vector3 (-radius, -radius, 0), new Vector3 (radius, radius, 0)]);	
	
			this .setSolid (false);
			this .setCurrentTexCoord (null);
		},
		traverse: function (context)
		{
			var
				browser = this .getBrowser (),
				shader  = browser .getShader ();

			if (shader === browser .getDefaultShader ())
			{
				browser .setTexture (null);
				browser .setShader (shader = browser .getLineShader ());
			}

			var primitiveMode = shader .primitiveMode;

			shader .primitiveMode = this .primitiveMode;

			X3DGeometryNode .prototype .traverse .call (this, context);

			shader .primitiveMode = primitiveMode;
		},
	});

	return Arc2D;
});


