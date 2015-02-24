
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
		function Disk2D (executionContext)
		{
			X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Disk2D);
		}

		Disk2D .prototype = $.extend (new X3DGeometryNode (),
		{
			constructor: Disk2D,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "innerRadius", new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "outerRadius", new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",       new SFBool (true)),
			]),
			getTypeName: function ()
			{
				return "Disk2D";
			},
			getComponentName: function ()
			{
				return "Geometry2D";
			},
			getContainerField: function ()
			{
				return "geometry";
			},
		});

		return Disk2D;
	}
});

