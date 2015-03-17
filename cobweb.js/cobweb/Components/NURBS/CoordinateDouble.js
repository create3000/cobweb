
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DCoordinateNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DCoordinateNode, 
          X3DConstants)
{
	with (Fields)
	{
		function CoordinateDouble (executionContext)
		{
			X3DCoordinateNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .CoordinateDouble);
		}

		CoordinateDouble .prototype = $.extend (new X3DCoordinateNode (),
		{
			constructor: CoordinateDouble,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "point",    new MFVec3d ()),
			]),
			getTypeName: function ()
			{
				return "CoordinateDouble";
			},
			getComponentName: function ()
			{
				return "NURBS";
			},
			getContainerField: function ()
			{
				return "coord";
			},
			isEmpty: function ()
			{
				return this .point_ .length == 0;
			},
		});

		return CoordinateDouble;
	}
});

