
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChildNode, 
          X3DConstants)
{
	with (Fields)
	{
		function BooleanFilter (executionContext)
		{
			X3DChildNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .BooleanFilter);
		}

		BooleanFilter .prototype = $.extend (new X3DChildNode (),
		{
			constructor: BooleanFilter,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",    new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "set_boolean", new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "inputTrue",   new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "inputFalse",  new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "inputNegate", new SFBool ()),
			]),
			getTypeName: function ()
			{
				return "BooleanFilter";
			},
			getComponentName: function ()
			{
				return "EventUtilities";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return BooleanFilter;
	}
});

