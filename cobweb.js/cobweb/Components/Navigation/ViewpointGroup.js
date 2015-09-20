
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Components/Navigation/X3DViewpointObject",
	"cobweb/Components/EnvironmentalSensor/ProximitySensor",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChildNode, 
          X3DViewpointObject,
          ProximitySensor,
          X3DCast,
          X3DConstants)
{
	with (Fields)
	{
		function ViewpointGroup (executionContext)
		{
			X3DChildNode       .call (this, executionContext .getBrowser (), executionContext);
			X3DViewpointObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .ViewpointGroup);
	   
			this .proximitySensor  = new ProximitySensor (executionContext);
			this .viewpointObjects = [ ];
		}

		ViewpointGroup .prototype = $.extend (Object .create (X3DChildNode .prototype),
			X3DViewpointObject .prototype,
		{
			constructor: ViewpointGroup,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "displayed",         new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "description",       new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "retainUserOffsets", new SFBool ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "size",              new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "center",            new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "children",          new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "ViewpointGroup";
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
				X3DChildNode       .prototype .initialize .call (this);
				X3DViewpointObject .prototype .initialize .call (this);
			   
				this .proximitySensor .setup ();

				this .size_   .addFieldInterest (this .proximitySensor .size_);
				this .center_ .addFieldInterest (this .proximitySensor .center_);

				this .proximitySensor .size_   = this .size_;
				this .proximitySensor .center_ = this .center_;

				this .displayed_ .addInterest (this, "set_displayed__");
				this .size_      .addInterest (this, "set_displayed__");
				this .children_  .addInterest (this, "set_children__");

				this .set_displayed__ ();
				this .set_children__ ();
			},
			isActive: function ()
			{
			   return this .proximitySensor .isActive_ .getValue ();
			},
			set_displayed__: function ()
			{
				var enabled = this .displayed_ .getValue () && ! this .size_ .getValue () .equals (Vector3 .Zero);

				this .setCameraObject (enabled);
				this .proximitySensor .enabled_ = enabled;

				if (enabled)
				   this .traverse = traverse;
				else
					delete this .traverse;
			},
			set_children__: function ()
			{
				this .viewpointObjects .length = 0;

				for (var i = 0, length = this .children_ .length; i < length; ++ i)
				{
					var viewpointObject = X3DCast (X3DConstants .X3DViewpointObject, this .children_ [i]);

					if (viewpointObject)
						this .viewpointObjects .push (viewpointObject);
				}
			},
			traverse: function () { },
		});

		function traverse (type)
		{
			if (this .size_ .getValue () .equals (Vector3 .Zero))
			{
				for (var i = 0; i < this .viewpointObjects .length; ++ i)
					this .viewpointObjects [i] .traverse (type);
			}
			else
			{
				this .proximitySensor .traverse (type);

				if (this .proximitySensor .isActive_ .getValue ())
				{
					for (var i = 0; i < this .viewpointObjects .length; ++ i)
						this .viewpointObjects [i] .traverse (type);
				}
			}
		}

		return ViewpointGroup;
	}
});

