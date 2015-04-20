
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
	with (Fields)
	{
		function Box (executionContext)
		{
			X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Box);
		}

		Box .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
		{
			constructor: Box,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "size",     new SFVec3f (2, 2, 2)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",    new SFBool (true)),
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

				if (size .equals (new Vector3 (2, 2, 2)))
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

					this .setVertices (vertices);
					this .setExtents  ([Vector3 .negate (scale), scale]);	
				}

				this .setSolid (this .solid_ .getValue ());
				this .setCurrentTexCoord (null);
			},
		});

		return Box;
	}
});
