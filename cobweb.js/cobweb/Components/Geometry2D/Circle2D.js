
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometryNode, 
          X3DConstants,
          Vector3)
{
"use strict";

	function Circle2D (executionContext)
	{
		X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .Circle2D);
	}

	Circle2D .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
	{
		constructor: Circle2D,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "radius",   new Fields .SFFloat (1)),
		]),
		getTypeName: function ()
		{
			return "Circle2D";
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
				this .getBrowser () .getCircle2DOptions () .addInterest (this, "eventsProcessed");
			else
				this .getBrowser () .getCircle2DOptions () .removeInterest (this, "eventsProcessed");
		},
		isLineGeometry: function ()
		{
			return true;
		},
		build: function ()
		{
			var
				gl         = this .getBrowser () .getContext (),
				options    = this .getBrowser () .getCircle2DOptions (),
				radius     = this .radius_ .getValue ();

			var
				points   = options .getVertices (),
				vertices = this .getVertices ();

			for (var i = 0, length = points .length; i < length; i += 4)
				vertices .push (points [i] * radius, points [i + 1] * radius, 0, 1);

			this .setExtents  ([new Vector3 (-radius, -radius, 0), new Vector3 (radius, radius, 0)]);
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

			shader .primitiveMode = browser .getContext () .LINE_LOOP;

			X3DGeometryNode .prototype .traverse .call (this, context);

			shader .primitiveMode = primitiveMode;
		},
	});

	return Circle2D;
});


