
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
		function Sphere (executionContext)
		{
			X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Sphere);
		}

		Sphere .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
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
					this .setVertices (options .getGeometry () .getVertices ());
					this .setExtents  (options .getGeometry () .getExtents ());
				}
				else
				{
					var
						defaultVertices = options .getGeometry () .getVertices (),
						vertices        = this .getVertices ();

					for (var i = 0; i < defaultVertices .length; i += 4)
					{
						vertices .push (radius * defaultVertices [i],
						                radius * defaultVertices [i + 1],
						                radius * defaultVertices [i + 2],
						                1);
					}

					this .setVertices (vertices);
					this .setExtents  ([new Vector3 (-radius, -radius, -radius), new Vector3 (radius, radius, radius)]);
				}

				this .setSolid (this .solid_ .getValue ());
				this .setCurrentTexCoord (null);
			},
		});

		return Sphere;
	}
});

