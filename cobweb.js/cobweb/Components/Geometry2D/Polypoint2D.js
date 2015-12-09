
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

	var vector = new Vector3 (0, 0, 0);

	function Polypoint2D (executionContext)
	{
		X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .Polypoint2D);
	}

	Polypoint2D .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
	{
		constructor: Polypoint2D,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "point",    new Fields .MFVec2f ()),
		]),
		getTypeName: function ()
		{
			return "Polypoint2D";
		},
		getComponentName: function ()
		{
			return "Geometry2D";
		},
		getContainerField: function ()
		{
			return "geometry";
		},
		initialize: function ()
		{
			X3DGeometryNode .prototype .initialize .call (this);

			this .setPrimitiveMode (this .getBrowser () .getContext () .POINTS);
		},
		isLineGeometry: function ()
		{
			return true;
		},
		build: function ()
		{
			var point = this .point_ .getValue ();

			for (var i = 0, length = point .length; i < length; ++ i)
			{
				var vertex = point [i];

				this .addVertex (vector .set (vertex .x, vertex .y, 0));
			}

			this .setSolid (false);
		},
		traverse: function (context)
		{
			var browser = this .getBrowser ();

			if (browser .getShader () === browser .getDefaultShader ())
				browser .setShader (browser .getPointShader ());

			X3DGeometryNode .prototype .traverse .call (this, context);
		},
	});

	return Polypoint2D;
});


