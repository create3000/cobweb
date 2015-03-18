
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

		Box .prototype = $.extend (new X3DGeometryNode (),
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
				var options = this .getBrowser () .getBoxOptions ();
				
				this .scale = this .size_ .getValue () .copy () .divide (2);

				this .setExtents   (options .getGeometry () .getExtents ());
				this .setNormals   (options .getGeometry () .getNormals ());
				this .setTexCoords (options .getGeometry () .getTexCoords ());
				this .setVertices  (options .getGeometry () .getVertices ());

				this .setSolid (this .solid_ .getValue ());
				this .setCurrentTexCoord (null);
			},
			traverse: function (context)
			{
				context .modelViewMatrix .scale (this .scale);

				X3DGeometryNode .prototype .traverse .call (this, context);
			},
		});

		return Box;
	}
});
