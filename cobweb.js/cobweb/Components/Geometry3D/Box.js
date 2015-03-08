
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

				for (var i = 0; i < options .normals .length; ++ i)
					this .addNormal (options .normals [i]);

				if (this .size_ .getValue () .equals (new Vector3 (2, 2, 2)))
				{
					for (var i = 0; i < options .triangles .length; ++ i)
						this .addTriangle (options .triangles [i]);			
				}
				else
				{
					var size1_2 = Vector3 .divide (this .size_ .getValue (), 2);

					for (var i = 0; i < options .triangles .length; ++ i)
						this .addTriangle (Vector3 .multVec (options .triangles [i], size1_2));			
				}
	
				this .setSolid (this .solid_ .getValue ());
				this .setCurrentTexCoord (null);
			},
		});

		return Box;
	}
});
