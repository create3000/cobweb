
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Sound/X3DSoundNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DSoundNode, 
          X3DConstants)
{
	with (Fields)
	{
		function Sound (executionContext)
		{
			X3DSoundNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Sound);
		}

		Sound .prototype = $.extend (new X3DSoundNode (),
		{
			constructor: Sound,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "intensity",  new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "spatialize", new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "location",   new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "direction",  new SFVec3f (0, 0, 1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "minBack",    new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "minFront",   new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "maxBack",    new SFFloat (10)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "maxFront",   new SFFloat (10)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "priority",   new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "source",     new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "Sound";
			},
			getComponentName: function ()
			{
				return "Sound";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return Sound;
	}
});

