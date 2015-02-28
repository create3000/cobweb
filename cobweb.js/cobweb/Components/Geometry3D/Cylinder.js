
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
		function Cylinder (executionContext)
		{
			X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Cylinder);
		}

		Cylinder .prototype = $.extend (new X3DGeometryNode (),
		{
			constructor: Cylinder,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "top",      new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bottom",   new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "side",     new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "height",   new SFFloat (2)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "radius",   new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",    new SFBool (true)),
			]),
			getTypeName: function ()
			{
				return "Cylinder";
			},
			getComponentName: function ()
			{
				return "Geometry3D";
			},
			getContainerField: function ()
			{
				return "geometry";
			},
		});

		return Cylinder;
	}
});

