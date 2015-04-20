
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DNode, 
          X3DConstants)
{
	with (Fields)
	{
		function Contour2D (executionContext)
		{
			X3DNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Contour2D);
		}

		Contour2D .prototype = $.extend (Object .create (X3DNode .prototype),
		{
			constructor: Contour2D,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",       new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "addChildren",    new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "removeChildren", new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "children",       new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "Contour2D";
			},
			getComponentName: function ()
			{
				return "NURBS";
			},
			getContainerField: function ()
			{
				return "trimmingContour";
			},
		});

		return Contour2D;
	}
});

