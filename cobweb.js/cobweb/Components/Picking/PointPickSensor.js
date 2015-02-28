
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Picking/X3DPickSensorNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DPickSensorNode, 
          X3DConstants)
{
	with (Fields)
	{
		function PointPickSensor (executionContext)
		{
			X3DPickSensorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .PointPickSensor);
		}

		PointPickSensor .prototype = $.extend (new X3DPickSensorNode (),
		{
			constructor: PointPickSensor,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "enabled",          new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",         new SFBool ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "objectType",       new MFString ("ALL")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "pickingGeometry",  new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "pickTarget",       new MFNode ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "pickedGeometry",   new MFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "intersectionType", new SFString ("BOUNDS")),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "sortOrder",        new SFString ("CLOSEST")),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "pickedPoint",      new MFVec3f ()),
			]),
			getTypeName: function ()
			{
				return "PointPickSensor";
			},
			getComponentName: function ()
			{
				return "Picking";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return PointPickSensor;
	}
});

