
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometryNode, 
          X3DConstants)
{
	with (Fields)
	{
		function Sphere (executionContext)
		{
			X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Sphere);
		}

		Sphere .prototype = $.extend (new X3DGeometryNode (),
		{
			constructor: Sphere,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "radius",   new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",    new SFBool (true)),
			]),
			getTypeName: function ()
			{
				return "Sphere";
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
					options = this .getBrowser () .getSphereOptions (),
					radius  = this .radius_ .getValue ();

				this .setNormals   (options .getGeometry () .getNormals ());
				this .setTexCoords (options .getGeometry () .getTexCoords ());

				if (radius === 1)
				{
					this .setExtents  (options .getGeometry () .getExtents ());
					this .setVertices (options .getGeometry () .getVertices ());
				}
				else
				{
					var vertices = options .getGeometry () .getVertices ();

					for (var i = 0; i < vertices .length; i += 4)
					{
						this .addVertex (new Vector3 (radius * vertices [i],
						                              radius * vertices [i + 1],
						                              radius * vertices [i + 2]));
					}
				}

				this .setSolid (this .solid_ .getValue ());
				this .setCurrentTexCoord (null);
			},
		});

		return Sphere;
	}
});

