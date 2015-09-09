
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Grouping/X3DGroupingNode",
	"cobweb/Components/Core/X3DSensorNode",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGroupingNode, 
          X3DSensorNode,
          X3DCast,
          TraverseType,
          X3DConstants)
{
	with (Fields)
	{
		function Collision (executionContext)
		{
			X3DGroupingNode .call (this, executionContext .getBrowser (), executionContext);
			X3DSensorNode   .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Collision);

			this .addAlias ("collide", this .enabled_);
		}

		Collision .prototype = $.extend (Object .create (X3DGroupingNode .prototype),
			X3DSensorNode .prototype,
		{
			constructor: Collision,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "enabled",        new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",       new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "collideTime",    new SFTime ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",       new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",     new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "proxy",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",    new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren", new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "children",       new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "Collision";
			},
			getComponentName: function ()
			{
				return "Navigation";
			},
			getContainerField: function ()
			{
				return "children";
			},
			initialize: function ()
			{
				X3DGroupingNode .prototype .initialize .call (this);
				//X3DSensorNode   .prototype .initialize .call (this); // We cannot only call the base of a *Object.
	
				this .proxy_ .addInterest (this, "set_proxy__");

				this .set_proxy__ ();
			},
			set_active: function (value)
			{
				if (this .isActive_ .getValue () !== value)
				{
					this .isActive_ = value;

					if (value)
						this .collideTime_ = this .getBrowser () .getCurrentTime ();
				}
			},
			set_proxy__: function ()
			{
			   this .proxyNode = X3DCast (X3DConstants .X3DChildNode, this .proxy_);
			},
			traverse: function (type)
			{
				switch (type)
				{
					case TraverseType .COLLISION:
					{
						if (this .enabled_ .getValue ())
						{
						   var collisions = this .getBrowser () .getCollisions ();

							collisions .push (this);

							if (this .proxyNode)
								this .proxyNode .traverse (type);

							else
								X3DGroupingNode .prototype .traverse .call (this, type);

							collisions .pop ();
						}

						break;
					}
					default:
						X3DGroupingNode .prototype .traverse .call (this, type);
						break;
				}
			},
		});

		return Collision;
	}
});

