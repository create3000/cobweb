
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

	var
		normal = new Vector3 (0, 0, 1),
		vector = new Vector3 (0, 0, 0);

	function TriangleSet2D (executionContext)
	{
		X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .TriangleSet2D);
	}

	TriangleSet2D .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
	{
		constructor: TriangleSet2D,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "vertices", new Fields .MFVec2f ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",    new Fields .SFBool (true)),
		]),
		getTypeName: function ()
		{
			return "TriangleSet2D";
		},
		getComponentName: function ()
		{
			return "Geometry2D";
		},
		getContainerField: function ()
		{
			return "geometry";
		},
		build: function ()
		{
			var vertices = this .vertices_ .getValue ();

			for (var i = 0, length = vertices .length; i < length; ++ i)
			{
				var vertex = vertices [i];

				this .addNormal (normal);
				this .addVertex (vector .set (vertex .x, vertex .y, 0));
			}

			this .setSolid (this .solid_ .getValue ());
		},
		buildTexCoords: function ()
		{
			var
				p         = this .getTexCoordParams (),
				min       = p .min,
				Ssize     = p .Ssize,
				texCoords = [ ],
				vertices  = this .vertices;

			this .texCoords .push (texCoords);

			for (var i = 0, length = this .vertices .length; i < length; i += 4)
			{
				texCoords .push ((vertices [i]     - min [0]) / Ssize,
				                 (vertices [i + 1] - min [1]) / Ssize,
				                 0,
				                 1);
			}
		},
		traverse: function (context)
		{
			context .geometryType = 2;

			X3DGeometryNode .prototype .traverse .call (this, context);

			context .geometryType = 3;
		},
	});

	return TriangleSet2D;
});


