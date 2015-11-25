
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

   var defaultSize = new Vector3 (2, 2, 2);
	function Box (executionContext)
	{
		X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .Box);
	}

	Box .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
	{
		constructor: Box,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "size",     new Fields .SFVec3f (2, 2, 2)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",    new Fields .SFBool (true)),
		]),
		getTypeName: function ()
		{
			return "Box";
		},
		getComponentName: function ()
		{
			return "Geometry3D";
		},
		getContainerField: function ()
		{
			return "geometry";
		},
		build: function ()
		{
			var
				options = this .getBrowser () .getBoxOptions (),
				size    = this .size_ .getValue ();

			this .setNormals   (options .getGeometry () .getNormals ());
			this .setTexCoords (options .getGeometry () .getTexCoords ());

			if (size .equals (defaultSize))
			{
				this .setVertices (options .getGeometry () .getVertices ());
				this .setExtents  (options .getGeometry () .getExtents ());
			}
			else
			{
				var
					scale           = Vector3 .divide (size, 2),
					x               = scale .x,
					y               = scale .y,
					z               = scale .z,
					defaultVertices = options .getGeometry () .getVertices (),
					vertices        = this .getVertices ();

				for (var i = 0; i < defaultVertices .length; i += 4)
				{
					vertices .push (x * defaultVertices [i],
					                y * defaultVertices [i + 1],
					                z * defaultVertices [i + 2],
					                1);
				}

				this .getMin () .set (-scale, -scale, -scale);
				this .getMax () .set ( scale,  scale,  scale);
			}

			this .setSolid (this .solid_ .getValue ());
			this .setCurrentTexCoord (null);
		},
	});

	return Box;
});

