
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Followers/X3DDamperNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DDamperNode, 
          X3DConstants)
{
	with (Fields)
	{
		function CoordinateDamper (executionContext)
		{
			X3DDamperNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .CoordinateDamper);
		}

		CoordinateDamper .prototype = $.extend (new X3DDamperNode (),
		{
			constructor: CoordinateDamper,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",           new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_value",          new MFVec3f ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_destination",    new MFVec3f ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "initialValue",       new MFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "initialDestination", new MFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "order",              new SFInt32 (3)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "tau",                new SFTime (0.3)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "tolerance",          new SFFloat (-1)),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",           new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",      new MFVec3f ()),
			]),
			getTypeName: function ()
			{
				return "CoordinateDamper";
			},
			getComponentName: function ()
			{
				return "Followers";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return CoordinateDamper;
	}
});

