
define ("cobweb/Components/Geometry2D/Polypoint2D",
[
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DLineGeometryNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DLineGeometryNode, 
          X3DConstants,
          Vector3)
{
"use strict";

	var vector = new Vector3 (0, 0, 0);

	function Polypoint2D (executionContext)
	{
		X3DLineGeometryNode .call (this, executionContext);

		this .addType (X3DConstants .Polypoint2D);
	}

	Polypoint2D .prototype = $.extend (Object .create (X3DLineGeometryNode .prototype),
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
			X3DLineGeometryNode .prototype .initialize .call (this);

			var browser = this .getBrowser ();

			this .setShader (browser .getPointShader ());
			this .setPrimitiveMode (browser .getContext () .POINTS);
			this .setSolid (false);
		},
		build: function ()
		{
			var point = this .point_ .getValue ();

			for (var i = 0, length = point .length; i < length; ++ i)
			{
				var vertex = point [i];

				this .addVertex (vector .set (vertex .x, vertex .y, 0));
			}
		},
	});

	return Polypoint2D;
});


