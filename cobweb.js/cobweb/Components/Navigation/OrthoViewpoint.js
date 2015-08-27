
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Navigation/X3DViewpointNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DViewpointNode, 
          X3DConstants)
{
	with (Fields)
	{
		function OrthoViewpoint (executionContext)
		{
			X3DViewpointNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .OrthoViewpoint);
		}

		OrthoViewpoint .prototype = $.extend (Object .create (X3DViewpointNode .prototype),
		{
			constructor: OrthoViewpoint,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "set_bind",          new SFBool ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "description",       new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "position",          new SFVec3f (0, 0, 10)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "orientation",       new SFRotation (0, 0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "centerOfRotation",  new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "fieldOfView",       new MFFloat ([ -1, -1, 1, 1 ])),
				new X3DFieldDefinition (X3DConstants .inputOutput, "jump",              new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "retainUserOffsets", new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isBound",           new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "bindTime",          new SFTime ()),
			]),
			getTypeName: function ()
			{
				return "OrthoViewpoint";
			},
			getComponentName: function ()
			{
				return "Navigation";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return OrthoViewpoint;
	}
});

